import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import * as utils from "./utils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
export const ReactNativeJoystick = ({ onStart, onMove, onStop, color = "#000000", backgroundColor = "#101010", radius = 150 }) => {
    const wrapperRadius = radius;
    const nippleRadius = wrapperRadius / 3;
    const [x, setX] = useState(wrapperRadius - nippleRadius);
    const [y, setY] = useState(wrapperRadius - nippleRadius);
    const handleTouchMove = useCallback((event) => {
        const e = event.changedTouches[0];
        const fingerX = e.x;
        const fingerY = Platform.OS === 'web' ? (wrapperRadius * 2 - e.y) : e.y;

        const angle = utils.calcAngle({ x: fingerX, y: fingerY }, { x: wrapperRadius, y: wrapperRadius });
        let dist = utils.calcDistance({ x: wrapperRadius, y: wrapperRadius }, { x: fingerX, y: fingerY });
        dist = Math.min(dist, wrapperRadius);
        var force = dist / (nippleRadius * 2);
        var screenX = (fingerX - wrapperRadius) / (wrapperRadius - nippleRadius);
        var screenY = (fingerY - wrapperRadius) / (wrapperRadius - nippleRadius);

        let coordinates = {
            x: fingerX - nippleRadius,
            y: fingerY - nippleRadius,
            screenX: screenX,
            screenY: screenY,
            distance: (Math.min(dist, wrapperRadius)/wrapperRadius) * 100,
        };

        if (angle > 160) {
            force = force*-1
        }

        // Vérification si le "nipple" du joystick a dépassé du joystick
        if (Math.abs(parseInt(coordinates.screenX)) > 1 || Math.abs(parseInt(coordinates.screenY)) > 1) {
            // Calcul des coordonnées normalisées en fonction de l'angle et de la distance
            coordinates.screenX = Math.cos(angle) * (dist / (wrapperRadius - nippleRadius))*0;
            coordinates.screenY = Math.sin(angle) * (dist / (wrapperRadius - nippleRadius))*0;
            coordinates.distance = 100;
        }
        
        const distance = Math.sqrt(screenX * screenX + screenY * screenY);
        const maxDistance = 1.5;

        if (distance > maxDistance) {
            // Limiter les coordonnées à la distance maximale en fonction de l'angle
            screenX = maxDistance * Math.cos(utils.degreesToRadians(angle));
            screenY = maxDistance * Math.sin(utils.degreesToRadians(angle));
        }

        // Empêcher le petit rond de sortir du grand rond
        if (dist >= wrapperRadius) {
            coordinates = utils.findCoord({ x: wrapperRadius, y: wrapperRadius }, dist, angle);
            coordinates = {
                x: coordinates.x - nippleRadius,
                y: coordinates.y - nippleRadius,
                screenX, // <-- ajout des coordonnées dans un repère orthonormé
                screenY, // <-- ajout des coordonnées dans un repère orthonormé
            };
        }

        setX(coordinates.x);
        setY(coordinates.y);
        onMove &&
            onMove({
                position: coordinates,
                angle: {
                    radian: utils.degreesToRadians(angle),
                    degree: angle,
                },
                force,
                type: "move",
            });
    }, [nippleRadius, wrapperRadius]);
    const handleTouchEnd = () => {
        setX(wrapperRadius - nippleRadius);
        setY(wrapperRadius - nippleRadius);
        onStop &&
            onStop({
                force: 0,
                position: {
                    x: 0,
                    y: 0,
                    screenX: 0,
                    screenY: 0,
                    distance: 0,
                },
                angle: {
                    radian: 0,
                    degree: 0,
                },
                type: "stop",
            });
    };
    const handleTouchStart = () => {
        onStart &&
            onStart({
                force: 0,
                position: {
                    x: 0,
                    y: 0,
                    screenX: 0,
                    screenY: 0,
                    distance: 0,
                },
                angle: {
                    radian: 0,
                    degree: 0,
                },
                type: "start",
            });
    };
    const panGesture = Gesture.Pan().onStart(handleTouchStart).onEnd(handleTouchEnd).onTouchesMove(handleTouchMove);
    const styles = useMemo(() => StyleSheet.create({
        wrapper: {
            width: 2 * radius,
            height: 2 * radius,
            borderRadius: radius,
            backgroundColor: `${backgroundColor}`,
            transform: [{ rotateX: "180deg" }],
        },
        nipple: {
            height: 2 * nippleRadius,
            width: 2 * nippleRadius,
            borderRadius: nippleRadius,
            backgroundColor: `${color}bb`,
            position: "absolute",
            transform: [
                {
                    translateX: x,
                },
                { translateY: y },
            ],
        },
    }), [radius, color, backgroundColor, nippleRadius, x, y]);
    return (<GestureDetector gesture={panGesture}>
      <View style={styles.wrapper}>
        <View pointerEvents="none" style={styles.nipple}></View>
      </View>
    </GestureDetector>);
};
//# sourceMappingURL=index.js.map
