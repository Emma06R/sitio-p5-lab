# Elaborado por: Ramirez Cruz Josué Emmanuel
# Nave vectorial y proyectiles 2D
import pygame
import sys
import math

# 1.- Inicializar Pygame y configurar la ventana
pygame.init()
ANCHO, ALTO = 800, 600
pantalla = pygame.display.set_mode((ANCHO, ALTO))
pygame.display.set_caption("Simulación Interactiva 2D - Nave Espacial")
reloj = pygame.time.Clock()

# 2.- Función de transformación geométrica 2D
def transformar_vertice(vertice, pos_x, pos_y, angulo, escala=1.0):
    x, y = vertice
    # Escalamiento
    x_esc, y_esc = x * escala, y * escala
    # Rotación (matemática continua)
    rad = math.radians(angulo)
    x_rot = x_esc * math.cos(rad) - y_esc * math.sin(rad)
    y_rot = x_esc * math.sin(rad) + y_esc * math.cos(rad)
    # Traslación al sistema de coordenadas de la pantalla
    return (x_rot + pos_x, y_rot + pos_y)


modelo_triangulo = [(0, -25), (-15, 15), (15, 15)]

# Variables de estado de la nave
pos_x, pos_y = 400.0, 300.0
angulo = 0.0
VELOCIDAD_NAVE = 4.0
VELOCIDAD_GIRO = 4.5
ESCALA = 1.0

# Estructura y control de disparo
proyectiles = []
ultimo_disparo = 0
COOLDOWN_DISPARO = 250  # Milisegundos entre disparos (250 ms)
VELOCIDAD_PROYECTIL = 9.0

# Bucle Principal de Renderizado
ejecutando = True
while ejecutando:
    # 1. Limpieza de pantalla (fondo oscuro)
    pantalla.fill((25, 25, 35))

    # 2. Manejo de eventos del sistema
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            ejecutando = False

    # 3. Lectura de controles por teclado
    teclas = pygame.key.get_pressed()
    tiempo_actual = pygame.time.get_ticks()

    # Rotación sobre su propio centroide (A / D o Flechas Izquierda / Derecha)
    if teclas[pygame.K_a] or teclas[pygame.K_LEFT]:
        angulo -= VELOCIDAD_GIRO
    if teclas[pygame.K_d] or teclas[pygame.K_RIGHT]:
        angulo += VELOCIDAD_GIRO

    # Avance Vectorial Continuo (W o Flecha Arriba)
    if teclas[pygame.K_w] or teclas[pygame.K_UP]:
        rad = math.radians(angulo)
        pos_x += math.sin(rad) * VELOCIDAD_NAVE
        pos_y -= math.cos(rad) * VELOCIDAD_NAVE

    # Reto Opcional (+10 Puntos Extra): Pantalla Envolvente (Screen Wrapping)
    pos_x = pos_x % ANCHO
    pos_y = pos_y % ALTO

    # Generación Dinámica de Proyectiles (Barra Espaciadora)
    if teclas[pygame.K_SPACE]:
        if tiempo_actual - ultimo_disparo >= COOLDOWN_DISPARO:
            # Calcular la posición exacta de la punta (proa) en el espacio de pantalla
            punta_local = modelo_triangulo[0]
            punta_x, punta_y = transformar_vertice(punta_local, pos_x, pos_y, angulo, ESCALA)
            
            # Calcular vector de velocidad del proyectil basado en la orientación de la nave
            rad = math.radians(angulo)
            vx = math.sin(rad) * VELOCIDAD_PROYECTIL
            vy = -math.cos(rad) * VELOCIDAD_PROYECTIL

            # Añadir nuevo proyectil a la lista dinámica
            proyectiles.append({
                'x': punta_x,
                'y': punta_y,
                'vx': vx,
                'vy': vy
            })
            ultimo_disparo = tiempo_actual

    # 4. Actualización y Gestión de Memoria de los Proyectiles
    proyectiles_activos = []
    for p in proyectiles:
        # Mover proyectil
        p['x'] += p['vx']
        p['y'] += p['vy']

        # Verificar si permanece dentro del lienzo de 800x600
        if 0 <= p['x'] <= ANCHO and 0 <= p['y'] <= ALTO:
            proyectiles_activos.append(p)

    # Reemplazar la lista con solo los proyectiles vigentes (libera memoria de los fuera de límites)
    proyectiles = proyectiles_activos

    # 5. Renderizado en pantalla
    
    # Dibujar la nave espacial
    vertices_pantalla = [
        transformar_vertice(v, pos_x, pos_y, angulo, ESCALA)
        for v in modelo_triangulo
    ]
    pygame.draw.polygon(pantalla, (0, 255, 180), vertices_pantalla, 2)

    # Dibujar proyectiles activos
    for p in proyectiles:
        pygame.draw.circle(pantalla, (255, 220, 50), (int(p['x']), int(p['y'])), 3)

    # Intercambiar búferes y mantener 60 FPS (Double Buffering)
    pygame.display.flip()
    reloj.tick(60)

pygame.quit()
sys.exit()
    