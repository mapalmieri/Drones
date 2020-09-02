#ifndef _misraC_drone_
#define _misraC_drone_

#include <assert.h>
#include <stdio.h>
#include "pvsioweb_utils.h"
#include "misraC_basic_types.h"
/**
 * operating modes
 */
typedef enum { hovering } Mode;

/**
 * state attributes
 */
typedef struct { 
    Mode mode;
    Mode previous_mode;
    float64_t C_phi; //-- real
    float64_t C_theta; //-- real
    float64_t C_z; //-- real
    float64_t current_phi; //-- real
    float64_t current_psi; //-- real
    float64_t current_theta; //-- real
    float64_t current_x; //-- real
    float64_t current_y; //-- real
    float64_t current_z; //-- real
    float64_t G; //-- real
    float64_t Ix; //-- real
    float64_t Iy; //-- real
    float64_t Iz; //-- real
    float64_t Kf; //-- real
    float64_t Km; //-- real
    float64_t L; //-- real
    float64_t La; //-- real
    float64_t Lp; //-- real
    float64_t M; //-- real
    float64_t phi_c; //-- real
    float64_t psi_d; //-- real
    float64_t theta_c; //-- real
    float64_t vel_phi; //-- real
    float64_t vel_psi; //-- real
    float64_t vel_theta; //-- real
    float64_t vel_x; //-- real
    float64_t vel_y; //-- real
    float64_t vel_z; //-- real
    float64_t w_1; //-- real
    float64_t w_2; //-- real
    float64_t w_3; //-- real
    float64_t w_4; //-- real
    float64_t w_phi; //-- real
    float64_t w_psi; //-- real
    float64_t w_theta; //-- real
    float64_t w_z; //-- real
    float64_t x_d; //-- real
    float64_t y_d; //-- real
    float64_t z_d; //-- real
} State;

/**
 * init function
 */
void init(State* st);

/**
 * triggers
 */
bool per_tick(State* st);
State* tick(State* st);


/**
 * leave/enter functions
 */
void enter(Mode m, State* st);
void leave(Mode m, State* st);

#endif
