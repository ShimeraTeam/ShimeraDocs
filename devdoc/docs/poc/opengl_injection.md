# OpenGL Injection 5 March 2025

## Overview
This document is the result of a POC (Proof of Concept) aimed at demonstrating how to inject OpenGL shaders into an application using SFML/SDL/Raylib while encapsulating all OpenGL calls within a dedicated library. The objective is to prove that we can create a generic library that can be used with multiple graphics libraries without exposing OpenGL details to the end user.