"""Effetti sonori dello spot 37 «Torna a trovarti»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(1.6), 0.2, 0.06)                                                  # il cliente si allontana
    put(s, a.pop(660), 0.8, 0.07); put(s, a.buzz(), 1.4, 0.05)                         # «Ultima visita»
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    put(s, a.shimmer(1318.5), 2.7, 0.07); put(s, a.pop(880), 3.2, 0.07)               # si ferma, «Richiamo automatico»
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for i in range(8): put(s, a.tick(800 + 50 * i), 5.2 + i * 0.1, 0.03)               # i giorni passano
    put(s, a.ding(1046.5), 6.05, 0.11); put(s, a.whoosh(0.8), 6.35, 0.07)              # parte la busta
    put(s, a.pop(784), 6.6, 0.06)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.whoosh(0.6), 7.75, 0.06); put(s, a.ding(1318.5), 8.45, 0.12)             # la busta arriva sul telefono
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.whoosh(0.7), 10.2, 0.06); put(s, a.click(), 10.9, 0.15); put(s, a.thud(), 10.92, 0.09)   # la prenotazione si posa
    put(s, a.pop(880), 10.95, 0.07); put(s, a.ding(1568), 11.2, 0.08)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
