from flask import Flask, render_template, request, jsonify, url_for
import json
import os
import datetime

app = Flask(__name__)

def load_json_file(filepath):
    if not os.path.exists(filepath):
        return {}
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json_file(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/lesson1')
def lesson1():
    return render_template('lesson1.html')

@app.route('/scenario1')
def scenario1():
    return render_template('scenario1.html')

@app.route('/scenario2')
def scenario2():
    return render_template('scenario2.html')

@app.route('/scenario3')
def scenario3():
    return render_template('scenario3.html')

@app.route('/scenario4')
def scenario4():
    return render_template('scenario4.html')

@app.route('/scenario5')
def scenario5():
    return render_template('scenario5.html')

@app.route('/scenario6')
def scenario6():
    return render_template('scenario6.html')

@app.route('/scenario7')
def scenario7():
    return render_template('scenario7.html')

@app.route('/lesson1/log_click', methods=['POST'])
def log_lesson1_click():
    data = request.get_json()
    user = data.get('user', 'default_user')
    action = data.get('action', 'unknown')
    slide = data.get('slide', 'unknown')
    timestamp = datetime.datetime.now().isoformat()

    filepath = 'data/lesson1_log.json'
    log_data = load_json_file(filepath)

    log_data.setdefault(user, []).append({
        "slide": slide,
        "action": action,
        "timestamp": timestamp
    })

    save_json_file(filepath, log_data)
    return jsonify({"status": "saved"})

@app.route('/scenario1/log_click', methods=['POST'])
def log_scenario1_click():
    data = request.get_json()
    user = data.get("user", "unknown")
    action = data.get("action", "unknown")
    timestamp = datetime.datetime.now().isoformat()

    filepath = 'data/scenario1_clicks.json'
    log_data = load_json_file(filepath)
    log_data.setdefault(user, []).append({
        "action": action,
        "timestamp": timestamp
    })
    save_json_file(filepath, log_data)
    return jsonify({"status": "logged"})

@app.route('/scenario7/log_click', methods=['POST'])
def log_scenario7_click():
    data = request.get_json()
    user = data.get('user', 'default_user')
    action = data.get('action', 'unknown')
    timestamp = datetime.datetime.now().isoformat()

    filepath = 'data/scenario7_log.json'
    log_data = load_json_file(filepath)

    log_data.setdefault(user, []).append({
        "action": action,
        "timestamp": timestamp
    })

    save_json_file(filepath, log_data)
    return jsonify({"status": "logged"})

@app.route('/scenario3/save_attempt', methods=['POST'])
def save_scenario3_attempt():
    data = request.get_json()
    user = "default_user"
    filepath = "data/scenario3_input.json"
    existing = load_json_file(filepath)

    existing.setdefault(user, []).append({
        "attempt": data.get("attempts"),
        "success": data.get("success"),
        "timestamp": datetime.datetime.now().isoformat()
    })

    save_json_file(filepath, existing)
    return jsonify({"status": "saved"})

@app.route('/lesson1/save_attempt', methods=['POST'])
def save_lesson1_attempt():
    data = request.get_json()
    filepath = "data/lesson1_log.json"
    user = "default_user"
    log = load_json_file(filepath)

    log.setdefault(user, []).append({
        "slide": data.get("slide"),
        "attempt": data.get("attempts"),
        "success": data.get("success"),
        "timestamp": datetime.datetime.now().isoformat()
    })

    save_json_file(filepath, log)
    return jsonify({"status": "saved"})

@app.route('/scenario4/skip', methods=['POST'])
def skip_scenario4():
    data = request.get_json()
    filepath = "data/scenario4_skip.json"
    log = load_json_file(filepath)

    user = "default_user"
    log.setdefault(user, []).append({
        "skipped": data.get("skipped"),
        "timestamp": data.get("timestamp")
    })

    save_json_file(filepath, log)
    return jsonify({"status": "saved"})

@app.route('/scenario5/save', methods=['POST'])
def save_scenario5():
    data = request.get_json()
    filepath = "data/scenario5_report.json"
    user = "default_user"
    log = load_json_file(filepath)

    log.setdefault(user, []).append({
        "attempt": data.get("attempt"),
        "success": data.get("success"),
        "timestamp": data.get("timestamp")
    })

    save_json_file(filepath, log)
    return jsonify({"status": "saved"})

if __name__ == '__main__':
    app.run(debug=True)
