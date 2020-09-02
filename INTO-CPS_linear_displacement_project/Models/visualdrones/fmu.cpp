/*! \file fmu.c
 * In this file there is the implementation of the functions required
 * by the FMI standard.
 * Most of them just return "fmi2OK" or "fmi2Error"
 * the most relevant so far are:
 * 		fmi2Instantiate
 * 		fmi2DoStep
 * 		fmi2FreeInstance
 * 		fmi2GetXXX
 * 		fmi2SetXXX
 *
 * This file is largely copied from the Fmu.cpp file
 * of Overture Extension for FMI
 * */
#include "fmu.h"

#define SSTR( x ) dynamic_cast< std::ostringstream & >( \
        ( std::ostringstream() << std::dec << x ) ).str()
        
FmiBuffer fmiBuffer;
fmi2String location;
const fmi2CallbackFunctions *g_functions;
std::string* name;

extern int watchdog;

template <class T>
static void log(const fmi2CallbackFunctions *functions, fmi2ComponentEnvironment componentEnvironment,
		fmi2String instanceName, fmi2Status status, fmi2String category, fmi2String message,T arg)
{
	if (functions != NULL && functions->logger != NULL)
	{
		functions->logger(componentEnvironment, instanceName, status, category, message,arg);
	}
}

template <class T>
static void fmiprintf(fmi2String message,T arg)
{
	if (g_functions != NULL)
	{
		log(g_functions, (void*) 2, name->c_str(), fmi2OK, "logAll",message, arg);
	}
}
static void fmiprintf(fmi2String message)
{
	if (g_functions != NULL)
	{
		log(g_functions, (void*) 2, name->c_str(), fmi2OK, "logAll",message, NULL);
	}
}




extern "C" fmi2Component fmi2Instantiate(
				fmi2String instanceName, 
				fmi2Type fmuType,
				fmi2String fmuGUID, 
				fmi2String fmuResourceLocation,
				const fmi2CallbackFunctions *functions,
				fmi2Boolean visible,
				fmi2Boolean loggingOn
			)
{
	name = new std::string (instanceName);
	g_functions = functions;
	initialize(fmuResourceLocation);
	return (void*) 2;
}

extern "C" fmi2Status fmi2SetupExperiment(
				fmi2Component c,
				fmi2Boolean toleranceDefined,
				fmi2Real tolerance,
				fmi2Real startTime,
				fmi2Boolean stopTimeDefined,
				fmi2Real stopTime) {
				
	createSocket();
	return fmi2OK;
}

extern "C" fmi2Status fmi2EnterInitializationMode(fmi2Component c) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2ExitInitializationMode(fmi2Component c) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2Terminate(fmi2Component c) {
	printf("Terminate\n");
	return fmi2OK;
}

extern "C" fmi2Status fmi2Reset(fmi2Component c) {
	return fmi2OK;
}

extern "C" void fmi2FreeInstance(fmi2Component c) {
	printf("FreeInstance\n");
	terminate();
}

/**---------------------------------------------------------------------
 * FMI functions: class methods not depending of a specific instance
 * ---------------------------------------------------------------------
 */
extern "C" const char* fmi2GetVersion() {
	return fmi2Version;
}

extern "C" const char* fmi2GetTypesPlatform() {
	return fmi2TypesPlatform;
}

/**--------------------------------------------------------------------------
* FMI functions: logging control, setters and getters for Real, Integer,
* Boolean, String
* ---------------------------------------------------------------------------
*/
extern "C" fmi2Status fmi2SetDebugLogging(fmi2Component c, fmi2Boolean loggingOn, size_t nCategories,
		const fmi2String categories[]) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetReal(fmi2Component c, const fmi2ValueReference vr[], size_t nvr, fmi2Real value[]) {
for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		value[i] = fmiBuffer.realBuffer[vRef];
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetInteger(fmi2Component c, const fmi2ValueReference vr[], size_t nvr, fmi2Integer value[]) {
for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		value[i] = fmiBuffer.intBuffer[vRef];
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetBoolean(fmi2Component c, const fmi2ValueReference vr[], size_t nvr, fmi2Boolean value[]) {
	for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		value[i] = fmiBuffer.booleanBuffer[vRef];
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetString(fmi2Component c, const fmi2ValueReference vr[], size_t nvr, fmi2String value[]) {
	for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		value[i] = fmiBuffer.stringBuffer[vRef];
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2SetReal(fmi2Component c, const fmi2ValueReference vr[], size_t nvr, const fmi2Real value[]) {
	for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		fmiBuffer.realBuffer[vRef] = value[i];
	//	printf("FMI real id=%d set to: %f\n", vRef, fmiBuffer.realBuffer[vRef]);
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2SetInteger(fmi2Component c, const fmi2ValueReference vr[], size_t nvr,
		const fmi2Integer value[]) {
	for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		fmiBuffer.intBuffer[vRef] = value[i];
    //	printf("FMI real id=%d set to: %f\n", vRef, fmiBuffer.intBuffer[vRef]);
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2SetBoolean(fmi2Component c, const fmi2ValueReference vr[], size_t nvr,
		const fmi2Boolean value[]) {
    for (size_t i = 0; i < nvr; i++) {
    		fmi2ValueReference vRef = vr[i];
    		fmiBuffer.booleanBuffer[vRef] = value[i];
    //		printf("FMI real id=%d set to: %f\n", vRef, fmiBuffer.booleanBuffer[vRef]);
	}
	return fmi2OK;
}

extern "C" fmi2Status fmi2SetString(fmi2Component c, const fmi2ValueReference vr[], size_t nvr,
		const fmi2String value[]) {
		for (size_t i = 0; i < nvr; i++) {
		fmi2ValueReference vRef = vr[i];
		strcpy(fmiBuffer.r[vRef],value[i]);
		fmiBuffer.stringBuffer[vRef]=fmiBuffer.r[vRef];
		}
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetFMUstate(fmi2Component c, fmi2FMUstate* FMUstate) {
	return fmi2OK;
}
extern "C" fmi2Status fmi2SetFMUstate(fmi2Component c, fmi2FMUstate FMUstate) {
	return fmi2OK;
}
extern "C" fmi2Status fmi2FreeFMUstate(fmi2Component c, fmi2FMUstate* FMUstate) {
	return fmi2OK;
}
extern "C" fmi2Status fmi2SerializedFMUstateSize(fmi2Component c, fmi2FMUstate FMUstate, size_t *size) {
	return fmi2OK;
}
extern "C" fmi2Status fmi2SerializeFMUstate(fmi2Component c, fmi2FMUstate FMUstate, fmi2Byte serializedState[],
		size_t size) {
	return fmi2OK;
}
extern "C" fmi2Status fmi2DeSerializeFMUstate(fmi2Component c, const fmi2Byte serializedState[], size_t size,
		fmi2FMUstate* FMUstate) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetDirectionalDerivative(fmi2Component c, const fmi2ValueReference vUnknown_ref[],
		size_t nUnknown, const fmi2ValueReference vKnown_ref[], size_t nKnown, const fmi2Real dvKnown[],
		fmi2Real dvUnknown[]) {
	return fmi2OK;
}

// ---------------------------------------------------------------------------
// Functions for FMI for Co-Simulation
// ---------------------------------------------------------------------------
#ifdef FMI_COSIMULATION
/* Simulating the slave */
extern "C" fmi2Status fmi2SetRealInputDerivatives(fmi2Component c, const fmi2ValueReference vr[], size_t nvr,
		const fmi2Integer order[], const fmi2Real value[]) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetRealOutputDerivatives(fmi2Component c, const fmi2ValueReference vr[], size_t nvr,
		const fmi2Integer order[], fmi2Real value[]) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2CancelStep(fmi2Component c) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2DoStep(fmi2Component c, fmi2Real currentCommunicationPoint, fmi2Real communicationStepSize,
		fmi2Boolean noSetFMUStatePriorToCurrentPoint) {
	doStep();
	if(watchdog==0)return fmi2OK;
	else return fmi2Error;
}

extern "C" fmi2Status fmi2GetStatus(fmi2Component c, const fmi2StatusKind s, fmi2Status *value) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetRealStatus(fmi2Component c, const fmi2StatusKind s, fmi2Real *value) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetIntegerStatus(fmi2Component c, const fmi2StatusKind s, fmi2Integer *value) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetBooleanStatus(fmi2Component c, const fmi2StatusKind s, fmi2Boolean *value) {
	return fmi2OK;
}

extern "C" fmi2Status fmi2GetStringStatus(fmi2Component c, const fmi2StatusKind s, fmi2String *value) {
	return fmi2OK;
}

/* INTO cps specific*/
extern "C" fmi2Status fmi2GetMaxStepsize(fmi2Component c, fmi2Real* size) {
	return fmi2OK;
}

// ---------------------------------------------------------------------------
// Functions for FMI2 for Model Exchange
// ---------------------------------------------------------------------------
#else
/* Enter and exit the different modes */
fmi2Status fmi2EnterEventMode(fmi2Component c) {
	return fmi2Error;
}

fmi2Status fmi2NewDiscreteStates(fmi2Component c, fmi2EventInfo *eventInfo) {
	return fmi2Error;
}

fmi2Status fmi2EnterContinuousTimeMode(fmi2Component c) {
	return fmi2Error;
}

fmi2Status fmi2CompletedIntegratorStep(fmi2Component c, fmi2Boolean noSetFMUStatePriorToCurrentPoint,
		fmi2Boolean *enterEventMode, fmi2Boolean *terminateSimulation) {
	return fmi2Error;
}

/* Providing independent variables and re-initialization of caching */
fmi2Status fmi2SetTime(fmi2Component c, fmi2Real time) {
	return fmi2Error;
}

fmi2Status fmi2SetContinuousStates(fmi2Component c, const fmi2Real x[], size_t nx) {
	return fmi2Error;
}

/* Evaluation of the model equations */
fmi2Status fmi2GetDerivatives(fmi2Component c, fmi2Real derivatives[], size_t nx) {
	return fmi2Error;
}

fmi2Status fmi2GetEventIndicators(fmi2Component c, fmi2Real eventIndicators[], size_t ni) {
	return fmi2Error;
}

fmi2Status fmi2GetContinuousStates(fmi2Component c, fmi2Real states[], size_t nx) {
	return fmi2Error;
}

fmi2Status fmi2GetNominalsOfContinuousStates(fmi2Component c, fmi2Real x_nominal[], size_t nx) {
	return fmi2Error;
}
#endif // Model Exchange
