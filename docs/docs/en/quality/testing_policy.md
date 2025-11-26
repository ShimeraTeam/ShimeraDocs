# **{Shimera} Testing Policy**
> A guide to describe the project's testing policies.

## Table of Contents
- [Testing Objectives](#testing-objectives)
- [Types of Tests](#types-of-tests)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [Functional Tests](#functional-tests)
  - [Performance Tests](#performance-tests)

### Testing Objectives

Unit tests will be used to verify the correct functioning of each feature and the SHIMERA shaders. Unit tests will be written in C++ using the Catch2 framework.

Integration tests will be conducted to validate the correct assembly of the library on different platforms and setups.

Performance tests will be used to check the speed of shader generation across different graphics libraries.

### Types of Tests

- ### Unit Tests

  We will use a tool capable of testing our shaders by comparing them to reference rendering images.

  Prior to testing, the reference images will be generated from the shader being tested in a graphics environment created for production.
  The tests will be verified based on the match percentage, related to the tolerance between the images.

  The results will be handled in three ways:
  - The test will pass if the match is above 95%.
  - The test will also pass if the match is above 90%, but a warning will be displayed so that the tester can verify whether the shader is problematic.*
  - The test will fail if the match is below 90%.

  (*) In the case where the test is automated on GitHub, a ticket will be generated.

- ### Integration Tests

  We will ensure that the library builds correctly on every merge to the development branch (dev) and the production branch (main). Additionally, these tests will include unit and performance tests on each merge.

- ### Functional Tests

  We will perform functional tests before validating recently added features. For this, we will use a recognized tool, _RenderDoc_, which allows capturing the order of graphic loading. This way, we can verify that shaders are correctly loaded in the proper sequence.

- ### Performance Tests

  We will create a program capable of measuring shader generation speed across different graphics libraries. The goal is to achieve the shortest possible time for shader generation on each graphics library.