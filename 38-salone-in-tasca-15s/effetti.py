"""Effetti sonori dello spot 38 «Il salone in tasca»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05); put(s, a.shimmer(1318.5), 0.3, 0.06)            # telefono già pieno
    for i in range(4): put(s, a.tick(1000 + 80 * i), 0.6 + i * 0.35, 0.03)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    put(s, a.pop(880), 2.6, 0.07)                                                      # «beaflow.it»
    for y in range(10): put(s, a.tick(900 + 40 * y), 2.75 + y * 0.12, 0.03)             # la pagina si carica
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for k in range(6): put(s, a.pop(700 + 40 * k), 5.2 + k * 0.09, 0.04)                # le icone
    put(s, a.click(), 6.0, 0.14); put(s, a.ding(1046.5), 6.05, 0.1)                     # diventa un'icona
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.click(), 7.85, 0.18); put(s, a.whoosh(0.6), 8.15, 0.06); put(s, a.shimmer(1318.5), 8.6, 0.08)   # tocco e apertura
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.whoosh(0.8), 10.2, 0.06); put(s, a.thud(), 10.95, 0.09)                    # entra in tasca
    put(s, a.ding(1568), 11.0, 0.12); put(s, a.pop(880), 11.05, 0.07)                   # nuova prenotazione
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
