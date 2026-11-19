"""Effetti sonori dello spot 40 «Chiusura cassa in un attimo»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py (a.put, a.tick, a.impact, …)."""


def effetti(s, a):
    put = a.put
    for i in range(16): put(s, a.tick(1400 if i % 2 else 1150), 0.2 + i * 0.13, 0.04)    # stampante e lancette
    put(s, a.buzz(), 1.0, 0.05)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)   # lo scontrino si riavvolge
    put(s, a.ding(1318.5), 2.8, 0.12)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)                    # il totale
    for i in range(10): put(s, a.tick(1000 + 80 * i), 5.15 + i * 0.05, 0.03)
    put(s, a.ding(1046.5), 5.7, 0.13)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.thud(), 8.0, 0.14); put(s, a.pop(784), 8.25, 0.12)                        # contanti e carte
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.whoosh(0.5), 10.95, 0.08); put(s, a.thud(), 11.5, 0.3); put(s, a.click(), 11.52, 0.12)   # la porta si chiude
    put(s, a.ding(880), 11.6, 0.1)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
