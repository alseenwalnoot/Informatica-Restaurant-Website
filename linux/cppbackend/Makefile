BACKEND_DIR=../cppbackend
FRONTEND_DIR=../react-frontend
BUILD_DIR=$(BACKEND_DIR)/build
TEMPLATES_DIR=$(BUILD_DIR)/templates
DIST_LINK=$(TEMPLATES_DIR)/dist

.PHONY: all backonly frontonly clean link run

all: clean backonly frontonly link run

backonly:
	rm -rf $(BUILD_DIR)
	mkdir -p $(BUILD_DIR)
	cd $(BUILD_DIR) && cmake .. && make

frontonly:
	cd $(FRONTEND_DIR) && npm run build

link:
	mkdir -p $(TEMPLATES_DIR)
	rm -f $(DIST_LINK)
	ln -s ../../$(FRONTEND_DIR)/dist $(DIST_LINK)

run:
	cd build && ./app
clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(FRONTEND_DIR)/dist

