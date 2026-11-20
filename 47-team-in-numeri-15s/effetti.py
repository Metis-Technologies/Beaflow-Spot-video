"""Effetti sonori dello spot 47 «Il team, in numeri»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05)
    for k in range(5): put(s, a.tick(600 + 40 * k), 0.4 + k * 0.3, 0.03)               # le persone, senza numeri
    put(s, a.buzz(), 1.6, 0.05)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    put(s, a.shimmer(1318.5), 2.8, 0.07); put(s, a.pop(880), 3.0, 0.07)                # «Performance Operatori»
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for k in range(3):                                                                   # gli indicatori si riempiono
        for j in range(4): put(s, a.tick(900 + 100 * k + 40 * j), 5.2 + k * 0.15 + j * 0.12, 0.025)
        put(s, a.pop(784 + 98 * k), 5.6 + k * 0.15, 0.06)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.riser(0.6), 7.8, 0.05)
    for k in range(3): put(s, a.coin(), 8.1 + k * 0.15, 0.08)                          # il fatturato
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.riser(0.8), 10.1, 0.06); put(s, a.ding(1568), 10.85, 0.09)                # le linee salgono
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
