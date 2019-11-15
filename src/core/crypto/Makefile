compile_wasm:
	clang aes.c --target=wasm32  -emit-llvm -c -S
	llc -march=wasm32 -filetype=obj aes.ll
	wasm-ld  --allow-undefined --no-entry --export-all --import-memory aes.o -o aes.wasm 
	rm aes.ll
	rm aes.o
