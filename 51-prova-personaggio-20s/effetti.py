"""Effetti sonori della prova 51 «Personaggio parlante» (stile Motion, 20 s): uno per ogni evento di sorgente/index.html.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.3), 0.08, 0.05)                                                   # il saluto
    for k, t in enumerate([0.26, 1.14, 1.98]):                                          # forbici, rasoio, pennello atterrano
        put(s, a.thud(), t, 0.2); put(s, a.pop(660 + 110 * k), t + 0.01, 0.06)
    for k, t in enumerate([2.7, 2.82, 2.95]): put(s, a.tick(820 + 90 * k), t, 0.08)    # domino
    put(s, a.whoosh(0.3), 3.1, 0.08); put(s, a.pop(988), 3.32, 0.1)                     # il pennello in mano
    put(s, a.whoosh(0.2), 3.45, 0.06); put(s, a.shimmer(1046.5), 3.6, 0.05)             # diventa il telefono
    for k, t in enumerate([4.55, 4.9, 5.25, 5.6]):                                      # le chat escono dal telefono
        put(s, a.pop(880 + 70 * k), t, 0.08); put(s, a.buzz(), t, 0.05)
    for k in range(3): put(s, a.tick(600 + 40 * k), 6.85 + 0.24 * k, 0.03)             # si gratta la testa
    put(s, a.click(), 7.5, 0.2); put(s, a.ding(1046.5), 7.54, 0.08)                     # tocco su Beaflow
    put(s, a.riser(0.6), 7.6, 0.1); put(s, a.whoosh(0.6), 7.9, 0.08)                    # onda d'oro
    for k in range(4): put(s, a.pop(784 + 60 * k), 8.8 + 0.14 * k, 0.07)               # le chat diventano righe
    put(s, a.whoosh(0.3), 9.15, 0.05)                                                   # indica l'elenco
    put(s, a.pop(988), 11.55, 0.08); put(s, a.ding(1318.5), 11.6, 0.07)                 # notifica
    put(s, a.whoosh(0.4), 12.4, 0.07); put(s, a.impact(), 12.76, 0.16)                  # cade nelle 16:30
    for k in range(4): put(s, a.tick(700 + 50 * k), 12.8 + 0.04 * k, 0.03)            # le righe sobbalzano
    put(s, a.ding(1568), 13.42, 0.12)                                                   # «Confermato»
    put(s, a.pop(1175), 13.75, 0.08)                                                    # pollice in su
    put(s, a.tick(1500), 15.12, 0.05)                                                   # occhiolino
    put(s, a.riser(0.5), 16.82, 0.12); put(s, a.impact(), 17.35, 0.34); put(s, a.shimmer(1318.5), 17.4, 0.1)
    put(s, a.click(), 18.1, 0.2)                                                        # «Inizia gratis»
