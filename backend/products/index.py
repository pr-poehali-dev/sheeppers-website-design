'''
Business: Products CRUD - get all products, create new product (admin only)
Args: event with httpMethod, body (for POST), headers (X-Session-Token for admin)
Returns: HTTP response with products list or created product
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
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        try:
            import psycopg2
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            cur.execute("""
                SELECT id, name, price, category, image, description, created_at
                FROM products
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            products: List[Dict[str, Any]] = []
            
            for row in rows:
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'price': row[2],
                    'category': row[3],
                    'image': row[4],
                    'description': row[5],
                    'created_at': row[6].isoformat() if row[6] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'products': products})
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
            
            name = body_data.get('name')
            price = body_data.get('price')
            category = body_data.get('category')
            image = body_data.get('image')
            description = body_data.get('description', '')
            
            if not all([name, price, category, image]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO products (name, price, category, image, description)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, name, price, category, image, description
            """, (name, price, category, image, description))
            
            row = cur.fetchone()
            conn.commit()
            
            new_product = {
                'id': row[0],
                'name': row[1],
                'price': row[2],
                'category': row[3],
                'image': row[4],
                'description': row[5]
            }
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'product': new_product})
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
