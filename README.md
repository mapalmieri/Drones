# Drones
Repository of the UAV FMI co-simulation with INTO-CPS and PVS formal prover

# Requirements
 1. Linux-like OS (currently tested on Ubuntu 16.04)
 2. Prototype Verification System (PVS), downloadable [here](http://pvs.csl.sri.com/cgi-bin/downloadlic.cgi?file=pvs-6.0-ix86_64-Linux-allegro.tgz) after acceptance of the license
 3. PVSio-web, downloadable [here](https://github.com/pvsioweb/pvsio-web)
 4. INTO-CPS Application, downloadable [here](https://github.com/INTO-CPS-Association/into-cps-application/releases/download/v4.0.0/into-cps-app-4.0.0-linux-x64.zip)
 
# Instructions for co-simulation

 1. Copy the PVS folder `pvs-6.0-ix86_64-Linux-allegro` in the following directories:
    1. models/coordination/resources/
    2. models/VisualDrones/resources/
    3. FMUS/coordination1.fmu{/resources}
    4. FMUS/coordination2.fmu{/resources}
    5. FMUS/coordination3.fmu{/resources}
    6. FMUS/coordination4.fmu{/resources}
    7. FMUS/coordination5.fmu{/resources}

...these last 5 directories are within the zip file of the fmu.

 2. Launch the INTO-CPS application and open the `INTO-CPS_linear_displacement_project` project

 3. If not already done, download the coe from the download manager of the INTO-CPS application (this is a one time only operation)

 4. Expand the `correct_MM` Multi-Model (+ button) and open the `co-sim` scenario

 5. Launch the COE and then start the simulation

 6. During the simulation open the `GUI/index.html` page in a browser (Chrome or Firefox).  

# Instructions for PVS proof

 0. Follow the instruction for the binaries installation of PVS that can be found [here](http://pvs.csl.sri.com/download.shtml)

 1. Launch the PVS application

 2. Type `alt+x` to enter the minibuffer command and then type `change-context`. Navigate to the folder `linear_displacement_PVS_proof` and press `enter`

 3. Open the theory `linear_disp`

 4. Type `alt+x` to enter the minibuffer command and type `prove-importchain`


