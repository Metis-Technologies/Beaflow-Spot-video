"""Effetti sonori dello spot 29 «Basta appuntamenti saltati»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05)
    for i in range(5): put(s, a.tick(900 - 60 * i), 0.4 + i * 0.3, 0.035)             # la sedia vuota si tinge di rosso
    put(s, a.buzz(), 1.5, 0.06)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)   # la luce vira all'oro
    put(s, a.shimmer(1318.5), 2.7, 0.07)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    put(s, a.ding(1318.5), 5.3, 0.14); put(s, a.ding(1318.5), 5.65, 0.1); put(s, a.ding(1568), 6.2, 0.1)   # la campanella suona
    put(s, a.pop(880), 5.6, 0.08)                                                       # «Promemoria»
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.whoosh(0.9), 7.65, 0.06); put(s, a.coin(), 7.8, 0.1)                       # il gettone vola
    put(s, a.click(), 8.45, 0.16); put(s, a.thud(), 8.47, 0.1); put(s, a.coin(), 8.5, 0.12)   # si incastra
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for i in range(6): put(s, a.tick(1000 + 100 * i), 10.3 + i * 0.1, 0.035)          # la sedia si riempie d'oro
    put(s, a.pop(784), 10.4, 0.08); put(s, a.ding(1046.5), 11.0, 0.11)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
