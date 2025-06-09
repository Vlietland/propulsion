In hindsight, I used the following software creation process:

1. Asked Claude to analyze the source code as I wasn't familiar with the setup anymore.
2. Created a preliminary map structure with ChatGPT.
3. Discussed possible open-source game engines with ChatGPT and selected Excalibur, as it supports Tiled and includes an open-source map editor.
4. Explored a physics framework with ChatGPT to simulate the combined ship-ball body framework.
5. Created a ship image and a ball (crystal) pod image using ChatGPT.
6. Conducted physics tests but decided to create custom physics with linear and angular acceleration, velocity, and motion. Unfortunately, this was mostly done manually because the engines struggled with the complexity involved.
7. Designed the first map using the Tiled map editor and collaborated with Claude to create the map generator.
8. Generated images for other actors using ChatGPT.
9. Added an actor factory to dynamically load actors based on map objects.
10. Implemented collision detection software that dynamically creates collision polygons based on loaded images, with Claude's assistance (a very helpful feature).
11. Developed a scene manager to dynamically load scenes based on map characteristics, including laser object groups.
12. Created the HUD to display the ship dashboard and status.
13. Added bullets and a tractor beam.
14. Integrated explosion, hyperspace, and other effects.
15. Designed a menu with buttons and screens.
16. Last but not least Claude4 helpt me a great deal with some tedious bug to get the excalibur-tiled module working on Github pages.

Conclusion:
- Compared to the 1997 endeavor, there was an estimated 10x speedup in creation.
- Speedup was partially achieved by the Excalibur, the map editor, and image generation.
- Significant acceleration was achieved through code generation and collaborative discussions with several LLMs.
- Generated code requires thorough review, otherwise the code get cluttered, often let the AI do the trail and error and resetting the version to find the root-cause and best solution, while discussing proposals.
- Refactoring the AI generated code, resulted in a up to 90% reduction in code, in particular due to loosely formulated prompts. Code-LLMs work best with small, instructive prompts.
- My end conclusion is that AI-generated games are only feasible with proper knowledge of software architecture and design.