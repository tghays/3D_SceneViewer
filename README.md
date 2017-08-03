# 3D_SceneViewer
Javascript web application that guides the user through the Mallard Creek Greenway System.  This is a component of the 2017 Charlotte Intern Project at Esri.


This script uses the ArcGIS Javascript API to create an automated tour through a 3D webscene.  There are 16 camera location points in an array containing the x,y,z position along with the tilt and heading of the camera.  The forward and back buttons iterate through these points, adding or subtracting 1 to the array index, respectively.  There are inverted-cones along the greenway with pop-ups enabled that include media (pictures), which are hosted on ArcGIS Online.

A live demo is available here.
