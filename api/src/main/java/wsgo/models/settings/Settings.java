package wsgo.models.settings;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import io.yawp.repository.annotations.Index;
import io.yawp.repository.annotations.Json;

import java.util.List;
import java.util.Map;

@Endpoint(path = "/settings", kind = "/settings_v2")
public class Settings {

    @Id
    IdRef<Settings> id;

    @Index(normalize = false)
    String domain;

    @Index(normalize = false)
    String version;

    @Json
    Map<String, List<RoomSettings>> rooms;

}
