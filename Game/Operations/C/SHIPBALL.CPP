/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de userdata 	(shipball.cpp)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staat de implementatie van de ship&balldata          */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/
#include        <iostream.h>
#include        <io.h>
#include        <fcntl.h>
#include        <stdio.h>
#include        <process.h>
#include	<math.h>
#include	<conio.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"
#include        "!!forc~1\c\screen.h"

#include        "!!forc~1\c\classen.h"
#include	"operat~1\c\shipball.cnt"
#include	"operat~1\c\shipball.hft"

void Shipballdata::initshipball(vector newshipposition, int newfuel)
  {
   FILE		*shipfile;
   FILE		*explosionfile;
   char		*shipnaam          = {"ship.mix"};
   char		*explosionnaam     = {"explos-s.mix"};

   if ((shipfile = fopen(shipnaam, "r")) == NULL)
     { cout << "cannot open file"; exit(-1); }
   else if (fseek(shipfile, 0, SEEK_SET) == !0)
     { cout << "seek errors"; exit(-1); }
   else
     {
      setmode(fileno(shipfile),O_BINARY); // het zijn binaire files
      if (fread(shipdata, sizeof(bouwsteen), aantalangles+1, shipfile) != aantalangles+1)
        { cout << "end of file detected"; exit(-1); }
     }
   fclose(shipfile);

   if ((explosionfile = fopen(explosionnaam, "r")) == NULL)
     { cout << "cannot open file"; exit(-1); }
   else if (fseek(explosionfile, 0, SEEK_SET) == !0)
     { cout << "seek errors"; exit(-1); }
   else
     {
      setmode(fileno(explosionfile),O_BINARY); // het zijn binaire files
      if (fread(explosiondata, sizeof(bouwsteen), shipexplosionsoorten, explosionfile) != shipexplosionsoorten)
        { cout << "end of file detected"; exit(-1); }
     }
   fclose(explosionfile);

   positions.ship         = newshipposition;
   oldshipdrawposition.Sx = Xscreenmidpos;
   oldshipdrawposition.Sy = Yscreenmidpos;
   oldballdrawposition.Sx = Xscreenmidpos;
   oldballdrawposition.Sy = Yscreenmidpos;
   XYvelocity.X           = 0;              // de wipeshipballroutine
   XYvelocity.Y	          = 0;
   Rvelocity	          = 0;
   shipdamage             = initshipdamage;
   fuel                   = newfuel;
   angle                  = initangle;
   connection             = deactive;
   hyperspacestatus       = 0;

   anglenr                = angle / rotatespeed;
   coors                  = postocoor();
  }


void Shipballdata::updateshipballstatus()
  {
   updateshipstatus();
   if (connection == active)
     updateballstatus();
   if (hyperspacestatus == deactive)
     checkhyperspacestatus();
   else hyperspacestatus++;
  }


void Shipballdata::updateshipballposition()
  {
   vectors     XYmove     = {0,0};
   vectors     rotatemove = {{0,0},{0,0}};

   if (connection == active)	// connection == active
     {
	if  (com.getthruststatus() == active)
	  {
	     vector Vthrustforce = forcevectorcreate(anglenr);
             XYmove     = shipballXYmove     (shipballXYversnelling     (Vthrustforce));
	     rotatemove = shipballrotatemove (shipballrotateversnelling (Vthrustforce));
          }
        else
	  {
             vector Vthrustforce = {0,0};
	     XYmove     = shipballXYmove     (Vthrustforce);
	     rotatemove = shipballrotatemove (0);
	  }
     }
   else		                // connection == deactive
     {
	if  (com.getthruststatus() == active)
	  XYmove = shipXYmove    (shipXYversnelling (forcevectorcreate(anglenr)));
	else
	  {
	     vector Vthrustforce = {0,0};
	     XYmove = shipXYmove (Vthrustforce);
          }
     }
   positions = add       (XYmove,rotatemove,positions);
   coors     = postocoor ();
  }


void Shipballdata::drawshipball()
  {
   intvec shipposition;

   bouwsteen *blokptr = &shipdata[anglenr];

   shipposition.Sx = positions.ship.X - map.getbasismapposition().Sx;
   shipposition.Sy = positions.ship.Y - map.getbasismapposition().Sy;

   shipsurfacehits = move.drawbig(shipposition,blokptr);

   oldshipdrawposition = shipposition;
   olddrawanglenr      = anglenr;

   if (connection == active)
     {
      shipposition.Sx = positions.ball.X - map.getbasismapposition().Sx;
      shipposition.Sy = positions.ball.Y - map.getbasismapposition().Sy;

      blokptr = &shipdata[ballnr];
      ballsurfacehits = move.drawbig(shipposition,blokptr);

      oldballdrawposition = shipposition;
     }
  }


void Shipballdata::wipeoldshipball()
  {
   bouwsteen *blokptr = &shipdata[olddrawanglenr];
   move.wipebig(oldshipdrawposition,blokptr);

   if (connection == active)
     {
      blokptr = &shipdata[ballnr];
      move.wipebig(oldballdrawposition,blokptr);
     }
  }

