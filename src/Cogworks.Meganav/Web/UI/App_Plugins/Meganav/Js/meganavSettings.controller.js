function MeganavSettings($scope, $controller, meganavResource, dialogService, entityResource) {

    $scope.dialogOptions = {
        currentTarget: null
    };

    if (!_.isEmpty($scope.model.value)) {
        $scope.dialogOptions.currentTarget = $scope.model.value;

        // v7.12 hack due to controller checking wrong variable
        $scope.model.url = $scope.model.value.url;
    }

    $scope.$on("formSubmitting", function (ev, args) {
        $scope.model.value = $scope.target;
    });

    // extend Umbraco Link Picker controller
    $controller("Umbraco.Dialogs.LinkPickerController", { $scope: $scope });

    // register custom select handler
    $scope.dialogTreeEventHandler.bind("treeNodeSelect", nodeSelectHandler);

    // destroy custom select handler
    $scope.$on('$destroy', function () {
        $scope.dialogTreeEventHandler.unbind("treeNodeSelect", nodeSelectHandler);
    });

    function nodeSelectHandler(ev, args) {
        if (!args.node.metaData.listViewNode) {
            meganavResource.getById(args.node.id).then(function (response) {
                angular.extend($scope.target, response.data);
            });
        }
    }

    // Handle image selection

    $scope.openMediaPicker = function () {
        dialogService.mediaPicker({ callback: populateImage });
    }

    function populateImage(item) {
        $scope.image = item;
        $scope.target.imageId = item.id;
        $scope.target.imageUrl = item.image;
    }

    $scope.removeImage = function () {
        $scope.image = undefined;
        $scope.target.imageId = 0;
        $scope.target.image = "";
    }

    // Load image from resources on initial data load
    console.log('Image?', $scope.image, $scope.target);
    if ($scope.target.imageId > 0) {
        entityResource.getById($scope.target.imageId, "Media").then(function (item) {
            $scope.image = item;
            console.log('loaded', $scope, item);
        });
    }
}

angular.module("umbraco").controller("Cogworks.Meganav.MeganavSettingsController", MeganavSettings);