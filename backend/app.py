from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return "Expense Tracker Backend Running"
@app.route('/expenses', methods=['GET'])
def get_expenses():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM expenses ORDER BY created_at DESC"
    cursor.execute(query)
    expenses = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(expenses)
@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.json
    title = data['title']
    amount = data['amount']
    category = data['category']
    connection = get_connection()
    cursor = connection.cursor()
    query = "INSERT INTO expenses (title, amount, category) VALUES (%s, %s, %s)"
    values = (title, amount, category)
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({
    "message": "Expense added successfully"
    })
@app.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    connection = get_connection()
    cursor = connection.cursor()
    query = "DELETE FROM expenses WHERE id = %s"
    cursor.execute(query, (id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({
    "message": "Expense deleted successfully"
    })
if __name__ == '__main__':
    app.run(debug=True)    