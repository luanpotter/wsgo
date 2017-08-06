package wsgo.models.settings;

import io.yawp.repository.shields.Shield;
import io.yawp.repository.IdRef;

public class SettingsShield extends Shield<Settings> {

    @Override
    public void defaults() {
        allow(false);
    }

    @Override
    public void show(IdRef<Settings> id) {
        allow(true);
    }

    @Override
    public void index(IdRef<?> parentId) {
        allow(true);
    }

}
