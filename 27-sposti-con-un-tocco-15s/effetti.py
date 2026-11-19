"""Effetti sonori dello spot 27 «Sposti con un tocco»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.click(), 0.12, 0.14); put(s, a.whoosh(1.0), 0.2, 0.08)                   # tocco e volo con la scia
    put(s, a.shimmer(1318.5), 0.9, 0.05); put(s, a.thud(), 1.9, 0.12); put(s, a.pop(988), 1.95, 0.08)   # atterra
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    put(s, a.click(), 2.8, 0.14); put(s, a.whoosh(1.1), 2.9, 0.07)                    # il dito lo prende e lo trascina
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for k in range(3): put(s, a.pop(660 + 120 * k), 5.2 + k * 0.13, 0.08)            # gli altri scendono a onda
    put(s, a.click(), 5.6, 0.14); put(s, a.thud(), 5.62, 0.1); put(s, a.ding(1046.5), 5.75, 0.1)   # si posa, «Gio 16:00»
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.whoosh(0.5), 7.45, 0.05)                                                  # il foglio entra
    for i in range(10): put(s, a.tick(700 + 50 * (i % 5)), 8.65 + i * 0.05, 0.04)    # si sbriciola in tessere
    put(s, a.whoosh(0.8), 8.65, 0.07); put(s, a.ding(1318.5), 9.4, 0.1)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.shimmer(1568), 10.2, 0.08)                                                # riflesso d'oro
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
