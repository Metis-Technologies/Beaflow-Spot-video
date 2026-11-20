"""Effetti sonori dello spot 30 «Servizi lunghi, zero incastri»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05)
    put(s, a.click(), 0.78, 0.14); put(s, a.thud(), 0.8, 0.08)                       # la barra lunga si incastra
    for i, t in enumerate([1.43, 1.68, 1.88, 2.03]): put(s, a.click(), t, 0.09 + 0.01 * i)   # le altre barre
    put(s, a.pop(880), 0.7, 0.07)                                                      # «3 ore»
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    for b in range(3): put(s, a.tick(900 + 120 * b), 2.8 + b * 0.25, 0.04)              # le tre durate crescono
    for b in range(3): put(s, a.pop(784 + 98 * b), 3.0 + b * 0.25, 0.06)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    put(s, a.whoosh(0.6), 5.45, 0.05); put(s, a.shimmer(1318.5), 5.6, 0.08)             # si apre la pausa
    put(s, a.pop(880), 5.95, 0.07)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.whoosh(0.6), 8.25, 0.06); put(s, a.click(), 8.85, 0.16); put(s, a.thud(), 8.87, 0.1)   # pacchetto
    put(s, a.ding(1046.5), 8.95, 0.1)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for i in range(8): put(s, a.tick(900 + 60 * i), 10.15 + i * 0.09, 0.03)          # l'agenda si riempie
    put(s, a.ding(1318.5), 11.1, 0.08)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
