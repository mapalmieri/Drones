/*! \file fmu.h
 * This file contains the definitions of the functions used by myfmu.cpp:
 * 		initialize(fmi2String );
 * 			this one needs the string as parameter to forward the path where the resources folder is unzipped
 *		void doStep(const char*);
 * 			this is the function called every time the fmi2DoStep is invoked
 *		void terminate();
 * 			this is the function called when the co-simulation terminates
 * 		FmiBuffer
 * 			This structure maintains all the variables that are accessed by means of fmi2GetXXX and fmi2SetXXX
 *
 **/
#ifndef FMU_H
#define FMU_H

#include "./fmi/fmi2Functions.h"
#include "FmuGUID.h"


#define BOOL_COUNT 40
#define INT_COUNT 40
#define REAL_COUNT 40
#define STRING_COUNT 40
#define FMI_COSIMULATION

struct FmiBuffer {
     fmi2Boolean booleanBuffer[BOOL_COUNT];
     fmi2Integer intBuffer[INT_COUNT];
     fmi2Real realBuffer[REAL_COUNT];
     fmi2String stringBuffer[STRING_COUNT];
};

extern struct FmiBuffer fmiBuffer;

void initialize(fmi2String);
void doStep(const char*);
void terminate();


#endif // FMU_H
