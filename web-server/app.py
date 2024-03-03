from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:*"])

@app.route('/execute', methods=['POST'])
def execute_script():
    command = request.json.get('command')
    try:
        # Use the system's temporary directory
        with tempfile.NamedTemporaryFile(delete=False, mode='w', suffix='.sh') as tmpfile:
            tmpfile.write(command)
            tmpfile_path = tmpfile.name
        
        # Ensure the temporary file is executable
        os.chmod(tmpfile_path, 0x775)
        
        # Execute the temporary file
        process = subprocess.Popen(['bash', tmpfile_path], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        # Cleanup: Remove the temporary file after execution
        # os.remove(tmpfile_path) # admin privileges required
        
        return jsonify({
            "stdout": stdout.decode('utf-8'),
            "stderr": stderr.decode('utf-8'),
            "returnCode": process.returncode
        })
    except Exception as e:
        # Cleanup if an error occurred after file creation
        # if 'tmpfile_path' in locals():
        #     os.remove(tmpfile_path) # admin privileges required
        
        # Return a generic error code of -1 for any exception
        return jsonify({
            "stderr": str(e).decode('utf-8'),
            "returnCode": -1
        }), 500

if __name__ == '__main__':
    print("try running: curl -X POST -H \"Content-Type: application/json\" -d \"{\\\"command\\\":\\\"echo Hello World\\\"}\" http://localhost:5000/execute")
    app.run(debug=True)
