/*! \file fmu.h
 * This file contains the definitions of the functions used by skeleton.cpp:
 * 		initialize(fmi2String );
 * 			this one needs the string as parameter to forward the path where the resources folder is unzipped
 *		void doStep();
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
#include <stdio.h>
#include <string.h>
#include <unistd.h>
/*#include <iostream>*/
#include <sys/types.h>
#include <sys/time.h>
#include <sys/wait.h>
#include "err.h"
#include <libwebsockets.h>
#include <signal.h>
#include <stdlib.h>
#include <vector>
#include <sstream>
#include <cmath>
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <locale.h>

#define MAX_MEMORY 2000

#define MAX_TIME 10

#define BOOL_COUNT 12
#define INT_COUNT 12
#define REAL_COUNT 12
#define STRING_COUNT 12
#define FMI_COSIMULATION

struct FmiBuffer {
     fmi2Boolean booleanBuffer[BOOL_COUNT];
     fmi2Integer intBuffer[INT_COUNT];
     fmi2Real realBuffer[REAL_COUNT];
     char r[STRING_COUNT][MAX_MEMORY];
     fmi2String stringBuffer[STRING_COUNT];
};

extern struct FmiBuffer fmiBuffer;

int PipeStatus();

void createSocket();

void start_PVSio_process(int&);

void restart_PVSio();

void PVSioEval(const char *);

bool PVSioPrint();

bool findPVSioPrompt(const char*);

void handleUserAction();

void initialize(fmi2String );

int open_websocket();

void close_websocket();

void handleUserAction(const char*);

void doStep();

void terminate();

int findVariable(const char*,const char *);

int findIndex(const char*,const char *);

void retrieveExternalVariables();

void writeOutputVariableDouble(int , int );
//void convertStateToDouble(int , int );
void writeOutputVariableInt(int , int );
//void convertStateToInt(int , int );
void writeOutputVariableBool(int , int );
//void convertStateToBool(int , int );
void writeOutputVariableString(int , int );
//void convertStateToString(int , int );



void readInputVariableDouble(int , double, int );
//void convertDoubleToState(int , double, int );
void readInputVariableInt(int , int, int );
//void convertIntToState(int , int, int );
void readInputVariableBool(int , bool, int );
//void convertBoolToState(int , bool, int );
void readInputVariableString(int , const char*, int );
//void convertStringToState(int , const char*, int );

 
#endif // FMU_H
