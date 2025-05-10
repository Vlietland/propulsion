PAGE 40,132
TITLE 

COMMENT *        
		Kleurentest
	
	*

CODE            SEGMENT

XX		PROC	NEAR
		ASSUME	CS:CODE

;------Hier begint het eigenlijke programma--------

		MOV	ax,0013h	;zet schermmode 320 x 200
		INT	10h

		MOV	ax,0A000h
		MOV	ds,ax

		MOV	bx,0h
		MOV	cx,0h
		MOV	di,0h

kleurinc1:	MOV	dx,10		;lengte van de lijntjes
nieuwpunt1:	  MOV	[di  ],cx	;vier punten naast
		  MOV	[di+1],cx	;elkaar afdrukken
		  MOV	[di+2],cx
		  MOV	[di+3],cx
		  MOV	[di+4],cx
		  MOV	[di+5],cx
		  MOV	[di+6],cx
		  MOV	[di+7],cx

		  ADD	di,320

		  DEC	dx
		JNZ	nieuwpunt1

		INC	cx
		ADD	bx,8
		MOV	di,bx

		CMP	bx,256		;32 kleuren
		JNZ	kleurinc1

nieuweregel:	MOV	bx,0h
		MOV	di,0h

		ADD	ax,0F0h
		MOV	ds,ax

kleurinc2:	MOV	dx,10		;lengte van de lijntjes
nieuwpunt2:	  MOV	[di  ],cx	;acht punten naast
		  MOV	[di+1],cx	;elkaar afdrukken
		  MOV	[di+2],cx
		  MOV	[di+3],cx
		  MOV	[di+4],cx
		  MOV	[di+5],cx
		  MOV	[di+6],cx
		  MOV	[di+7],cx

		  ADD	di,320

		  DEC	dx
		JNZ	nieuwpunt2

		INC	cx
		ADD	bx,8
		MOV	di,bx

		CMP	bx,192		;24 kleuren
		JNZ	kleurinc2

		CMP	ax,0A900h	;wordt 9 keer uitgevoerd
		JL	nieuweregel

		MOV	ax,0C07h
		INT	21h

		MOV	ax,4C00h
		INT	21h

		RET
XX	        ENDP

CODE            ENDS
;---------------------------------------------------------
		END      XX
