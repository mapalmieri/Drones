/**
 * utility functions
 */
#include <math.h>
#include <time.h>
#include "misraC_basic_types.h"

//- get today's date and time in compact format DD.MM.YYYY hh:mm
char_t* get_todays_date();
//- C has a built-in function pow10, which computes 10^i -- no need to define it
//- trims the fractional number to the number of digits indicated as argument
float64_t trim(double x, int n);
