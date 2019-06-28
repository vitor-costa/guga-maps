import os
from flask import Flask, send_from_directory, render_template
# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/static', template_folder='static')
app._version = ""


@app.route('/')
def root():
    if not app._version:
        app._version = os.environ.get("VERSION", "")
    return render_template('index.html', version=app._version)


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join('.', 'static'), filename)


@app.route('/favicon.ico')
def serve_favicon():
    return send_from_directory(os.path.join('.', 'static'), "mug.png")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
