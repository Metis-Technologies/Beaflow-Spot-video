"""Effetti sonori dello spot 22 «Il passaparola, premiato»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05)
    put(s, a.coin(), 0.5, 0.1); put(s, a.coin(), 0.7, 0.09)                            # «+ punti» sui due clienti
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.4, 0.1)   # si torna a uno
    put(s, a.whoosh(0.5), 3.5, 0.06); put(s, a.pop(880), 3.55, 0.1)                   # si sdoppia, parte l'invito
    put(s, a.whoosh(0.6), 3.7, 0.05); put(s, a.ding(1046.5), 4.4, 0.1)               # l'invito arriva
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for i in range(6): put(s, a.tick(1100 + 90 * i), 5.3 + i * 0.07, 0.03)           # i dischi si caricano
    put(s, a.coin(), 5.55, 0.12); put(s, a.coin(), 5.8, 0.12)                          # punti a tutti e due
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for k in range(5): put(s, a.pop(660 + 110 * k), 7.6 + k * 0.38, 0.07)             # la rete fiorisce anello per anello
    put(s, a.shimmer(1318.5), 8.9, 0.06)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for i in range(8): put(s, a.thud(), 10.1 + i * 0.12, 0.05)                         # la pila di prenotazioni
    put(s, a.ding(1318.5), 10.7, 0.12)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
