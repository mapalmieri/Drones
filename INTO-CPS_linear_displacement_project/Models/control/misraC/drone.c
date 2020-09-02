#include "drone.h"
/**
 * init function
 */
void init(State* st) { 
    st->previous_mode = hovering;
    st->mode = hovering;
    st->C_phi = 939.627586f;
    st->C_theta = 939.627586f;
    st->C_z = 6.264183905f;
    st->current_phi = 0.0f;
    st->current_psi = 0.0f;
    st->current_theta = 0.0f;
    st->current_x = 0.0f;
    st->current_y = 0.0f;
    st->current_z = 0.0f;
    st->G = 9.81f;
    st->Ix = 0.001f;
    st->Iy = 0.001f;
    st->Iz = 0.001f;
    st->Kf = 1.0f;
    st->Km = 1.0f;
    st->L = 0.3f;
    st->La = 4.0f;
    st->Lp = 0.4f;
    st->M = 1.0f;
    st->phi_c = 0.0f;
    st->psi_d = 0.0f;
    st->theta_c = 0.0f;
    st->vel_phi = 0.0f;
    st->vel_psi = 0.0f;
    st->vel_theta = 0.0f;
    st->vel_x = 0.0f;
    st->vel_y = 0.0f;
    st->vel_z = 0.0f;
    st->w_1 = 0.0f;
    st->w_2 = 0.0f;
    st->w_3 = 0.0f;
    st->w_4 = 0.0f;
    st->w_phi = 0.0f;
    st->w_psi = 0.0f;
    st->w_theta = 0.0f;
    st->w_z = 0.0f;
    st->x_d = 0.0f;
    st->y_d = 0.0f;
    st->z_d = 0.0f;
}

/**
 * leave/enter functions
 */
void enter(Mode m, State* st) { 
    st->mode = m;
}
void leave(Mode m, State* st) { 
    st->previous_mode = m;
}

/**
 * triggers
 */
bool per_tick(State* st) {
    return (st->mode == hovering && ( TRUE ));
}
State* tick(State* st) {
    // assert( per_tick(st) );
    if (st->mode == hovering && ( TRUE )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == hovering && ( TRUE )");
        #endif
        leave(hovering, st);
        
        st->phi_c = - (2.0f * st->Lp * st->vel_x + st->Lp * st->Lp * (st->current_x - st->x_d)) * (sin(st->psi_d) / st->G) + (2.0f * st->Lp * st->vel_y + st->Lp * st->Lp *( st->current_y - st->y_d ))* (cos(st->psi_d) / st->G);
        st->theta_c = - (2.0f * st->Lp * st->vel_x + st->Lp * st->Lp * (st->current_x - st->x_d)) * (cos(st->psi_d) / st->G) - (2.0f * st->Lp * st->vel_y + st->Lp * st->Lp * (st->current_y - st->y_d)) * (sin(st->psi_d) / st->G);
        st->w_z = - st->vel_z * 2.0f * st->Lp / st->C_z - (st->current_z - st->z_d) * st->Lp * st->Lp / st->C_z;
        st->w_phi = - st->vel_phi * 2.0f * st->La / st->C_phi - (st->current_phi - st->phi_c) * st->La * st->La / st->C_phi;
        st->w_theta = - st->vel_theta * 2.0f * st->La /( st->L * sqrt(st->M * st->G * st->Kf) / st->Iy) - (st->current_theta - st->theta_c) * st->La * st->La / (st->L * sqrt(st->M * st->G * st->Kf) / st->Iy);
        st->w_psi = - st->vel_psi * 2.0f * st->La / (st->Km * sqrt(st->M * st->G * st->Kf) / st->Iz) - (st->current_psi - st->psi_d) * st->La * st->La / (st->Km * sqrt(st->M * st->G * st->Kf) / st->Iz);
        
        
        printf("%s\n",st->x_d);
        st->w_1 = st->w_z / 4.0f 		+ 0.0f 					- st->w_theta / 2.0f 					+ st->w_psi / 4.0f;
        st->w_2 = st->w_z / 4.0f 		+ st->w_phi / 2.0f 		+ 0.0f 									- st->w_psi / 4.0f;
        st->w_3 = st->w_z / 4.0f 		+ 0.0f 					+ st->w_theta / 2.0f 					+ st->w_psi / 4.0f;
        st->w_4 = st->w_z / 4.0f 		- st->w_phi / 2.0f 		+ 0.0f 									- st->w_psi / 4.0f;
        enter(hovering, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}




