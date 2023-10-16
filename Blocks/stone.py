from block import *
import pygame

class Stone(Block):
    def __init__(self):
        self.name = "stone"

    def draw(self, x, y, screen):
        block = pygame.image.load("../../Textures/stone.png")
        self.x = x
        self.y = y
        screen.blit(x, y)
