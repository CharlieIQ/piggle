import pygame

class Block:
    def __init__(self, x_position, y_position, block_type):
        self.x = x_position
        self.y = y_position
        self.block_type = block_type
        self.size = 16
