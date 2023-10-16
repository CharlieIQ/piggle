import pygame
from Blocks import stone 

pygame.init()

# Set the width and height of the screen to monitor size
infoObject = pygame.display.Info()
screen_x = infoObject.current_w
screen_y = infoObject.current_h
# Create Screen
screen = pygame.display.set_mode((screen_x, screen_y))
# Set title of game
pygame.display.set_caption("Block Game")

# Loop until the user clicks the close button.
done = False
 
# Used to manage how fast the screen updates
clock = pygame.time.Clock()

# Keep a list of blocks
blocks = []

for x in range(0, screen_x, 16):
    for y in range(0, screen_y, 16):
        stone = stone.Stone(x, y, "Stone")
        

#  Main Program Loop
while not done:
    # Main event loop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
    
    for stone in blocks:
        stone.draw(screen, x, y)
    # Update screen
    pygame.display.flip()

    # Set to 60fps
    clock.tick(60)