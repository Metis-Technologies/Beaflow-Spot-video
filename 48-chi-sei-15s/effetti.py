"""Effetti sonori dello spot 48 «Chi sei» v2: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""

ICONE = [0.0, 0.93, 1.73, 2.72, 3.15, 3.78, 4.58]   # forbici, rasoio, pennello, loto, smalto, pietre, tatuaggio (come SEQ in scena.js)


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.6), 0.05, 0.05)
    for k, t in enumerate(ICONE):                                                       # un'icona per ogni attività
        if k: put(s, a.whoosh(0.3), t - 0.3, 0.035)
        put(s, a.pop(784 + 50 * k), t + 0.1 if k == 0 else t, 0.07)
    put(s, a.riser(0.45), 2.05, 0.08); put(s, a.impact(), 2.5, 0.2); put(s, a.whoosh(0.5), 2.45, 0.08)
    put(s, a.riser(0.45), 4.55, 0.1); put(s, a.impact(), 5.0, 0.22); put(s, a.whoosh(0.5), 4.95, 0.1)
    for i in range(8): put(s, a.pop(600 + 50 * i), 5.1 + i * 0.12, 0.035)               # messaggi che arrivano
    for k in range(4): put(s, a.buzz(), 5.4 + k * 0.5, 0.05)                             # telefono che vibra
    put(s, a.pop(660), 5.7, 0.06)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for y in range(10): put(s, a.tick(900 + 40 * y), 7.75 + y * 0.06, 0.03)              # la pagina si compone
    put(s, a.click(), 8.4, 0.16); put(s, a.ding(1046.5), 8.45, 0.1)                       # «Prenota»
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.riser(1.0), 10.1, 0.05); put(s, a.ding(1568), 11.15, 0.12)                  # anello completo e spunta
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
