"""Effetti sonori dello spot 49 «Lo vedi subito»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.6), 0.0, 0.05)
    for y in range(8): put(s, a.tick(900 + 40 * y), 0.1 + y * 0.05, 0.03)              # lo schermo si compone
    put(s, a.click(), 1.1, 0.2); put(s, a.pop(988), 1.3, 0.08); put(s, a.ding(1046.5), 1.4, 0.1)   # tocco su «Prenota»
    put(s, a.riser(0.45), 2.05, 0.08); put(s, a.impact(), 2.5, 0.22); put(s, a.whoosh(0.5), 2.45, 0.08)
    for k in range(8): put(s, a.tick(700 + 50 * k), 2.7 + k * 0.05, 0.025)             # l'agenda compare
    put(s, a.whoosh(1.0), 2.75, 0.1)                                                     # la prenotazione vola
    put(s, a.riser(0.45), 4.55, 0.1); put(s, a.impact(), 5.0, 0.18); put(s, a.whoosh(0.5), 4.95, 0.08)
    put(s, a.pop(784), 5.2, 0.1); put(s, a.ding(1318.5), 5.25, 0.12)                    # si incastra alle 15:00
    put(s, a.whoosh(0.6), 7.3, 0.07); put(s, a.impact(), 7.5, 0.12)
    for k in range(6): put(s, a.pop(600 + 40 * k), 7.55 + k * 0.04, 0.03)              # cornetta e fumetti
    put(s, a.whoosh(0.4), 8.0, 0.07)                                                     # spariscono
    for k, t in enumerate([8.45, 8.85, 9.25]): put(s, a.pop(880 + 110 * k), t, 0.07); put(s, a.ding(1046.5 * (1.12 ** k)), t + 0.03, 0.06)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for k in range(4): put(s, a.tick(1000 + 60 * k), 10.1 + k * 0.12, 0.04)            # la giornata si riempie
    put(s, a.ding(1568), 10.9, 0.12)                                                     # spunta
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
