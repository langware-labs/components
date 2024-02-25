from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app, origins=["http://localhost:*"])

@app.route('/execute', methods=['POST'])
def execute_script():
    command = request.json.get('command')
    try:
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        return jsonify({
            "stdOut": stdout.decode('utf-8'),
            "stdErr": stderr.decode('utf-8'),
            "returnCode": process.returncode
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("try running: curl -X POST -H \"Content-Type: application/json\" -d \"{\\\"command\\\":\\\"ls\\\"}\" http://localhost:5000/execute")
    app.run(debug=True)
