import { Node, tween } from "cc";
import { TWinningEffect, TWinningEffects } from "db://shared-components/game/balance-effect/scripts/stores/balance-effect-store";
import { WinningEffectContainer } from "../../../../assets/game/balance-effect/scripts/components/winning-effect-container";

import { Container } from "inversify";

jest.mock("db://shared-components/shared/common-components/node-container/node-container", () => {
    return {
        NodeContainer: class MockNodeContainer {
            createNode = jest.fn(() => mockCreatedNode);
            node = { addChild: jest.fn(), emit: jest.fn() };
        },
    };
});

let mockCreatedNode;

describe("WinningEffectContainer", () => {
    let container: Container;
    let winningEffectContainer: WinningEffectContainer;

    beforeEach(() => {
        container = new Container();
        winningEffectContainer = new WinningEffectContainer();
        container.bind(WinningEffectContainer).toSelf();
        winningEffectContainer = container.get(WinningEffectContainer);
        // Patch createNode to return a new mock node each time
        mockCreatedNode = new Node();
        jest.spyOn(winningEffectContainer, "createNode").mockImplementation(() => mockCreatedNode);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("playWinningEffect", () => {
        it("should create a node, add it to effectNode, and call tween chain", () => {
            // Arrange
            const effectNode = new Node();
            effectNode.addChild = jest.fn();
            const effect: TWinningEffect = { effectNode, status: true };
            winningEffectContainer.duration = 5;

            // Act
            winningEffectContainer.playWinningEffect(effect);

            // Assert
            expect(winningEffectContainer.createNode).toHaveBeenCalled();
            expect(effectNode.addChild).toHaveBeenCalledWith(mockCreatedNode);
            expect(tween).toHaveBeenCalledWith(mockCreatedNode);
            const tweenChain = tween.mock.results[0].value;
            expect(tweenChain.delay).toHaveBeenCalledWith(5);
            expect(tweenChain.destroySelf).toHaveBeenCalled();
            expect(tweenChain.start).toHaveBeenCalled();
        });

        it("should do nothing if effectNode is missing", () => {
            // Arrange
            const effect: TWinningEffect = { effectNode: null, status: true };

            // Act
            winningEffectContainer.playWinningEffect(effect);

            // Assert
            expect(winningEffectContainer.createNode).not.toHaveBeenCalled();
        });
    });

    describe("winEffectMainPlayer", () => {
        it("should call playWinningEffect with the main player effect", () => {
            // Arrange
            const effect: TWinningEffect = { effectNode: new Node(), status: true };
            const spy = jest.spyOn(winningEffectContainer, "playWinningEffect");

            // Act
            winningEffectContainer.winEffectMainPlayer(effect);

            // Assert
            expect(spy).toHaveBeenCalledWith(effect);
        });
    });

    describe("winEffectAroundTablePlayers", () => {
        it("should call playWinningEffect for each winning effect", () => {
            // Arrange
            const effect1: TWinningEffect = { effectNode: new Node(), status: true };
            const effect2: TWinningEffect = { effectNode: new Node(), status: false };
            const effects: TWinningEffects = { winningEffects: [effect1, effect2] };
            const spy = jest.spyOn(winningEffectContainer, "playWinningEffect");

            // Act
            winningEffectContainer.winEffectAroundTablePlayers(effects);

            // Assert
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(effect1);
            expect(spy).toHaveBeenCalledWith(effect2);
        });

        it("should do nothing if winningEffects is missing", () => {
            // Arrange
            const effects: TWinningEffects = { winningEffects: null };
            const spy = jest.spyOn(winningEffectContainer, "playWinningEffect");

            // Act
            winningEffectContainer.winEffectAroundTablePlayers(effects);

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
