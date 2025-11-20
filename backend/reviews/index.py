'''
Business: Reviews CRUD - get reviews for product, create new review
Args: event with httpMethod, queryStringParameters (product_id), body (for POST)
Returns: HTTP response with reviews or created review
'''

import json
import os
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        try:
            import psycopg2
            
            query_params = event.get('queryStringParameters') or {}
            product_id = query_params.get('product_id')
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            if product_id:
                cur.execute("""
                    SELECT id, product_id, author_name, rating, comment, created_at
                    FROM reviews
                    WHERE product_id = %s
                    ORDER BY created_at DESC
                """, (product_id,))
            else:
                cur.execute("""
                    SELECT id, product_id, author_name, rating, comment, created_at
                    FROM reviews
                    ORDER BY created_at DESC
                """)
            
            rows = cur.fetchall()
            reviews: List[Dict[str, Any]] = []
            
            for row in rows:
                reviews.append({
                    'id': row[0],
                    'product_id': row[1],
                    'author_name': row[2],
                    'rating': row[3],
                    'comment': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'reviews': reviews})
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'POST':
        try:
            import psycopg2
            
            body_data = json.loads(event.get('body', '{}'))
            
            product_id = body_data.get('product_id')
            author_name = body_data.get('author_name')
            rating = body_data.get('rating')
            comment = body_data.get('comment')
            
            if not all([product_id, author_name, rating, comment]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            if not (1 <= rating <= 5):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Rating must be between 1 and 5'})
                }
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO reviews (product_id, author_name, rating, comment)
                VALUES (%s, %s, %s, %s)
                RETURNING id, product_id, author_name, rating, comment, created_at
            """, (product_id, author_name, rating, comment))
            
            row = cur.fetchone()
            conn.commit()
            
            new_review = {
                'id': row[0],
                'product_id': row[1],
                'author_name': row[2],
                'rating': row[3],
                'comment': row[4],
                'created_at': row[5].isoformat() if row[5] else None
            }
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'review': new_review})
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
