"""Effetti sonori dello spot 50 «Chi ha prenotato» (stile Motion): uno per ogni evento di sorgente/index.html.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    for k, t in enumerate([0.45, 1.1, 1.75]):                                           # forbici, rasoio, pennello atterrano
        put(s, a.thud(), t, 0.22); put(s, a.pop(660 + 110 * k), t + 0.01, 0.06)
    for k, t in enumerate([2.12, 2.26, 2.4]): put(s, a.tick(820 + 90 * k), t, 0.08)      # domino
    put(s, a.whoosh(0.5), 2.4, 0.1)                                                       # il pennello esce a destra
    put(s, a.whoosh(0.3), 2.85, 0.08); put(s, a.impact(), 3.1, 0.2)                       # rientra e urta il telefono
    put(s, a.shimmer(1046.5), 3.14, 0.05)                                                 # lo schermo si accende
    for k, t in enumerate([3.3, 3.6, 3.9, 4.2, 4.5]):                                     # arrivano le chat
        put(s, a.pop(880 + 70 * k), t, 0.08); put(s, a.buzz(), t, 0.05)
    put(s, a.buzz(), 4.75, 0.08); put(s, a.buzz(), 5.0, 0.06)                             # il telefono vibra
    put(s, a.click(), 5.42, 0.2); put(s, a.ding(1046.5), 5.46, 0.08)                      # tocco su Beaflow
    put(s, a.riser(0.6), 5.5, 0.1); put(s, a.whoosh(0.6), 5.75, 0.08)                     # onda d'oro
    for k in range(5): put(s, a.pop(784 + 60 * k), 6.66 + 0.13 * k, 0.07)               # i fumetti diventano righe
    put(s, a.pop(988), 9.05, 0.08); put(s, a.ding(1318.5), 9.1, 0.07)                     # notifica
    put(s, a.whoosh(0.4), 9.5, 0.07); put(s, a.impact(), 9.86, 0.16)                      # cade nelle 16:30
    for k in range(5): put(s, a.tick(700 + 50 * k), 9.9 + 0.04 * k, 0.03)               # le righe sobbalzano
    put(s, a.ding(1568), 10.56, 0.12)                                                     # «Confermato»
    put(s, a.riser(0.5), 12.32, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 13.6, 0.2)                                                          # «Inizia gratis»
