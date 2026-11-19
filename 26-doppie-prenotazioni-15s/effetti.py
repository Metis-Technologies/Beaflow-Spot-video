"""Effetti sonori dello spot 26 «Mai più doppie prenotazioni»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(1.2), 0.15, 0.06); put(s, a.whoosh(1.2), 0.35, 0.05)               # due appuntamenti in volo
    put(s, a.thud(), 1.3, 0.12); put(s, a.buzz(), 1.55, 0.07); put(s, a.thud(), 1.6, 0.14)   # lo scontro
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    put(s, a.shimmer(1318.5), 2.6, 0.1); put(s, a.pop(988), 2.65, 0.12)               # lo scudo respinge
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    put(s, a.click(), 5.2, 0.14); put(s, a.pop(784), 5.3, 0.08)                       # casella bloccata, «Occupato»
    put(s, a.whoosh(0.6), 5.6, 0.06); put(s, a.thud(), 6.3, 0.1); put(s, a.ding(1046.5), 6.35, 0.1)   # scivola sulla libera
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.pop(784), 7.7, 0.08); put(s, a.pop(880), 7.85, 0.08)                     # telefono e gestionale
    put(s, a.shimmer(1318.5), 8.3, 0.08); put(s, a.shimmer(1568), 8.6, 0.08)          # deviati dallo scudo
    put(s, a.thud(), 8.9, 0.08); put(s, a.thud(), 9.2, 0.08)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for i in range(8): put(s, a.tick(1000 + 70 * i), 10.1 + i * 0.08, 0.03)           # onda sulle colonne
    put(s, a.ding(1318.5), 10.9, 0.1)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
