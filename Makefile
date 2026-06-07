all:
	pxt install
	pxt build

serve:
	pxt serve

clean:
	pxt clean

.PHONY: all serve clean
