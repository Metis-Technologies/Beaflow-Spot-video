"""Effetti sonori dello spot 43 «Le tue ore di punta»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(1.0), 0.1, 0.06); put(s, a.shimmer(1318.5), 0.4, 0.07)            # la mappa già in rilievo
    put(s, a.pop(880), 0.5, 0.08); put(s, a.ding(1046.5), 1.2, 0.07)                    # «Sab · 11:00»
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    for d in range(6): put(s, a.tick(700 + 90 * d), 2.85 + d * 0.18, 0.04)            # si solleva giorno per giorno
    put(s, a.pop(784), 3.3, 0.06)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for k in range(3): put(s, a.pop(988 - 100 * k), 5.4 + k * 0.2, 0.07)               # classifica
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for k in range(3): put(s, a.thud(), 8.55 + k * 0.25, 0.08); put(s, a.click(), 8.55 + k * 0.25, 0.06)   # le persone si posano
    put(s, a.pop(880), 9.0, 0.06)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for i in range(10): put(s, a.tick(900 + 50 * i), 10.15 + i * 0.06, 0.03)          # agenda piena
    put(s, a.shimmer(1318.5), 10.9, 0.07)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
