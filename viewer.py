import os
from flask import render_template, jsonify
from myapp import app

UPLOAD_FOLDER = "static/uploads"
VIDEO_FOLDER  = "static/videos"

VIDEO_META = {
    "BetãoFight.mp4":    {"title": "Betão Fight 🥊",        "categoria": "momentos",  "data": "Março 2026"},
    "TiagoConfuse.mp4":  {"title": "Tiago Confuso 😂",       "categoria": "momentos",  "data": "Abril 2026"},
    "flexoes.mp4":       {"title": "Flexões Challenge 💪",   "categoria": "esportes",  "data": "Maio 2026"},
    "mlkC.mp4":          {"title": "Mlk C 🎬",               "categoria": "momentos",  "data": "Junho 2026"},
    "surraChimango.mp4": {"title": "Surra do Chimango 😅",   "categoria": "momentos",  "data": "Agosto 2026"},
}

MAX_FOTOS_HOME = 4

@app.route('/')
def homepage():
    fotos_all = sorted(os.listdir(UPLOAD_FOLDER))
    fotos = fotos_all[:MAX_FOTOS_HOME]
    total_fotos = len(fotos_all)
    videos_raw = sorted(os.listdir(VIDEO_FOLDER))
    videos = []
    for v in videos_raw:
        meta = VIDEO_META.get(v, {"title": v.replace(".mp4","").replace("_"," ").title(), "categoria": "geral", "data": "2026"})
        videos.append({"arquivo": v, **meta})
    return render_template('index.html', fotos=fotos, videos=videos, total_fotos=total_fotos)

@app.route('/videos')
def all_videos():
    videos_raw = sorted(os.listdir(VIDEO_FOLDER))
    videos = []
    for v in videos_raw:
        meta = VIDEO_META.get(v, {"title": v.replace(".mp4","").replace("_"," ").title(), "categoria": "geral", "data": "2026"})
        videos.append({"arquivo": v, **meta})
    return render_template('videos.html', videos=videos)

@app.route('/fotos')
def all_fotos():
    fotos = sorted(os.listdir(UPLOAD_FOLDER))
    return render_template('fotos.html', fotos=fotos)
