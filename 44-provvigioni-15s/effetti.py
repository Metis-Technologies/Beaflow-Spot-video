"""Effetti sonori dello spot 44 «Provvigioni senza calcoli»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(1.2), 0.1, 0.07)                                                  # fogli che volano
    for i in range(7): put(s, a.key(), 0.35 + i * 0.22, 0.05)                          # tasti battuti a mano
    put(s, a.buzz(), 1.75, 0.05)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    put(s, a.whoosh(0.8), 2.65, 0.06); put(s, a.shimmer(1318.5), 2.9, 0.07)            # si scompone, fogli in pila
    for k in range(5): put(s, a.tick(1000 + 60 * k), 3.0 + k * 0.08, 0.03)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for k in range(12): put(s, a.click(), 5.15 + k * 0.09, 0.035)                     # le quote si impilano
    put(s, a.pop(784), 5.6, 0.06)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for k in range(3): put(s, a.coin(), 8.15 + k * 0.25, 0.08); put(s, a.pop(880 + 98 * k), 8.17 + k * 0.25, 0.05)   # totali
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for k in range(3): put(s, a.pop(784 + 98 * k), 10.4 + k * 0.15, 0.06)              # riepilogo
    put(s, a.ding(1046.5), 10.9, 0.08)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
