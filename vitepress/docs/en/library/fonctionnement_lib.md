# **{Shimera} How Shimera Works**

## Development Steps

1. **Examples without OpenGL shaders**  
   We start by creating examples without using shaders, to validate the basic functionality.

2. **Direct addition of shaders**  
   Shaders are then integrated into the examples directly, **without encapsulation or classes**.

3. **Encapsulation of OpenGL calls**  
   OpenGL calls are encapsulated within the library, allowing examples to use only SFML.

4. **Encapsulation of SFML calls needed for shaders**  
   SFML calls used to invoke OpenGL shaders are also encapsulated.

5. **Simplified user usage**  
   The user only needs **a single call to display a shader**, regardless of the graphics backend.

---

## Library Architecture

- The **OpenGL** part is independent and works with all supported graphics libraries.  
- **Specific interfaces and abstractions** add details for each target library.  
  - Example: SFML provides specific calls to invoke shaders.  
- The goal is to provide a simple and unified interface for the user, hiding all the complexity of low-level calls.

![alt text](/schema-fonctionnement.png)