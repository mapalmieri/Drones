model quadcopter
  Modelica.Blocks.Interfaces.RealInput w1 annotation(
    Placement(visible = true, transformation(origin = {-98, 76}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-98, 76}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealInput w2 annotation(
    Placement(visible = true, transformation(origin = {-98, 28}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-98, 28}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealInput w3 annotation(
    Placement(visible = true, transformation(origin = {-98, -28}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-98, -28}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealInput w4 annotation(
    Placement(visible = true, transformation(origin = {-98, -80}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-98, -80}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput x annotation(
    Placement(visible = true, transformation(origin = {110, 96}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, 96}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput y annotation(
    Placement(visible = true, transformation(origin = {110, 66}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, 66}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput z annotation(
    Placement(visible = true, transformation(origin = {110, 32}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, 32}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput phi annotation(
    Placement(visible = true, transformation(origin = {110, -6}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, -6}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput theta annotation(
    Placement(visible = true, transformation(origin = {110, -46}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, -46}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput psi annotation(
    Placement(visible = true, transformation(origin = {110, -82}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, -82}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput dx annotation(
    Placement(visible = true, transformation(origin = {110, 84}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, 84}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput dy annotation(
    Placement(visible = true, transformation(origin = {110, 54}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, 54}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput dz annotation(
    Placement(visible = true, transformation(origin = {110, 20}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, 20}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput dphi annotation(
    Placement(visible = true, transformation(origin = {110, -18}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, -18}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput dpsi annotation(
    Placement(visible = true, transformation(origin = {110, -94}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, -94}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput dtheta annotation(
    Placement(visible = true, transformation(origin = {110, -60}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {110, -60}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));

parameter Real g = 9.81;
  parameter Real l = 0.3;
  parameter Real Kf = 1;
  parameter Real Km = 1;
  parameter Real m = 1;
  parameter Real Ixx = 0.001;
  parameter Real Iyy = 0.001;
  parameter Real Izz = 0.001;
  parameter Real x0=0;
  parameter Real y0=0;
  parameter Real z0=0;
  parameter Real psid_0=0;
  
  Real psid;
initial equation
  x = x0;
  y = y0;
  z = z0;
  phi = 0;
  theta = 0;
  psi = 0;
equation
  psid=psid_0;
  der(x) = dx;
  der(dx) = g * sin(psid) * phi + g * cos(psid) * theta;
  der(y) = dy;
  der(dy) = - (g * cos(psid) * phi) + g * sin(psid) * theta;
  der(z) = dz;
  der(dz) = 2 * sqrt(Kf * g / m) * (w1 + w2 + w3 + w4);
  der(phi) = dphi;
  der(dphi) = (l * sqrt(m * g * Kf) / Ixx) * (w2 - w4);
  der(theta) = dtheta;
  der(dtheta) = (l * sqrt(m * g * Kf) / Iyy) * (w3 - w1);
  der(psi) = dpsi;
  der(dpsi) = (Km * sqrt(m * g * Kf) / Izz) * (w1 - w2 + w3 - w4);
  annotation(
    uses(Modelica(version = "3.2.2")),
    Diagram(coordinateSystem(initialScale = 1)),
    Icon(coordinateSystem(initialScale = 0.5)),
    version = "",
    __OpenModelica_commandLineOptions = "");
end quadcopter;