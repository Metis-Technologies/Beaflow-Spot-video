"""Effetti sonori dello spot 42 «I numeri parlano»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(1.2), 0.05, 0.07)                                                  # la camera vola sulla città
    for i in range(8): put(s, a.tick(700 + 70 * i), 0.15 + i * 0.14, 0.035)            # le barre crescono
    put(s, a.shimmer(1318.5), 1.3, 0.06)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    for k in range(8): put(s, a.tick(900 + 60 * k), 2.7 + k * 0.1, 0.03)               # ricavi nel tempo
    put(s, a.pop(880), 3.1, 0.07)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    put(s, a.whoosh(0.6), 5.1, 0.05); put(s, a.coin(), 5.55, 0.09); put(s, a.pop(784), 5.6, 0.07)   # scontrino medio
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for y in range(7): put(s, a.click(), 7.65 + y * 0.05, 0.03)                        # le due colonne
    for y in range(8): put(s, a.click(), 8.0 + y * 0.05, 0.035)
    put(s, a.ding(1046.5), 8.3, 0.1); put(s, a.pop(880), 8.32, 0.06)                    # +12%
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.riser(0.8), 10.1, 0.06); put(s, a.ding(1568), 10.9, 0.1)                   # la linea sale, la freccia
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
