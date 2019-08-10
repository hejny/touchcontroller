function logMultitouches(multiTouchController, logElement) {
    multiTouchController.multiTouches.subscribe(function(multitouch) {
        //var color = '#' + Math.floor(Math.random() * 16777215).toString(16);

        var logMultitouch = $(
            '<div class="log-multitouch"><div class="log-title">' +
                multitouch +
                '</div><div class="log-multitouch-last-transformation"></div></div>',
        );
        $(logElement).append(logMultitouch);

        multitouch.transformations().subscribe(function(transformation) {
            $(logMultitouch).find('.log-multitouch-last-transformation').html(`
                        <table>
                            <tr>
                                <th>Translate:</th>
                                <td>${transformation.translate}</td>
                            </tr>
                            <tr>
                                <th>Rotate:</th>
                                <td>${transformation.rotate}</td>
                            </tr>
                            <tr>
                                <th>Scale:</th>
                                <td>${transformation.scale}</td>
                            </tr>
                        </table>
                    `);
        });

        multitouch.touches.subscribe(
            function(touch) {
                var logTouch = $(
                    '<div class="log-touch"><div class="log-title">' +
                        touch +
                        '</div><div class="log-touch-frames"></div><div class="log-touch-last-frame"></div></div></div>',
                );
                $(logMultitouch).append(logTouch);
                var framesCounter = 0;

                touch.frames.subscribe(
                    function(frame) {
                        $(logTouch)
                            .find('.log-touch-frames')
                            .text(framesCounter++);
                        $(logTouch).find('.log-touch-last-frame').html(`
                        <table>
                            <tr>
                                <th>Position:</th>
                                <td>${frame.position}</td>
                            </tr>
                            <tr>
                                <th>Time:</th>
                                <td>${frame.time}</td>
                            </tr>
                            <tr>
                                <th>Rotation:</th>
                                <td>${frame.rotation}</td>
                            </tr>
                            <tr>
                                <th>Scale:</th>
                                <td>${frame.scale}</td>
                            </tr>
                            <tr>
                                <th>Force:</th>
                                <td>${frame.force}</td>
                            </tr>
                            <tr>
                                <th>Radius:</th>
                                <td>${frame.radius}</td>
                            </tr>
                        </table>
                    `);
                    },
                    function() {},
                    function() {
                        logTouch.remove();
                    },
                );
            },
            function() {},
            function() {
                logMultitouch.remove();
            },
        );
    });
}
