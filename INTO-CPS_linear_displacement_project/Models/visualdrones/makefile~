CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -fPIC -shared -o VisualDrones.so skeleton.o fmu.o -Wl,-rpath,. -lwebsockets -lssl -lcrypto -pthread
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv VisualDrones.so binaries/linux64/
	cp /usr/lib/x86_64-linux-gnu/libwebsockets.so.7 binaries/linux64/
	zip -r VisualDrones.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run3:
	./fmuCheck.linux64 -h 1E-03 VisualDrones.fmu
run4:
	./fmuCheck.linux64 -h 1E-04 VisualDrones.fmu

clean:
	rm -rf  VisualDrones.o fmu.o skeleton.o
