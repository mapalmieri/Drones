/**
 * utility functions
 */

#include "pvsioweb_utils.h"

//- get today's date and time in compact format DD.MM.YYYY hh:mm
char_t* get_todays_date() {
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    return tm.tm_mday + "." + (tm.tm_mon + 1) + "." + (tm.tm_year + 1900) + " " + tm.tm_hour + ":" + tm.tm_min;
}

//- C has a built-in function pow10, which computes 10^i -- no need to define it
//- trims the fractional number to the number of digits indicated as argument
float64_t trim(double x, int n) {
    if (n == 0) { return floor(x); }
    float_64 div = pow10(n);
    return floor(x * div) / div;
}

